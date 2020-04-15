import { createConnection } from 'promise-mysql'
import { v4 as uuid4 } from 'uuid'
import { makeData, makeFindBy } from './QueryBuilder'

export const QB_CONDITIONS = {
    EQ: '=',
    NE: '!=',
    LT: '<',
    LTE: '<=',
    GT: '>',
    GTE: '>=',
    INTERVAL: 'BETWEEN'
}

export enum DbQueryConditionType {
    EQ,
    NE,
    LT,
    LTE,
    GT,
    GTE,
    INTERVAL,
}

export type DbQueryCondition = {
    column: string
    value: any
    condition?: DbQueryConditionType
}

export default class Database {
    #connection
    #connected

    constructor() {
        this.#connected = false

        this.makeConnection()
    }

    private async makeConnection() {
        const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env

        console.debug('[Database] Initializing MySQL Connection', { DB_HOST, DB_USER, DB_PASS, DB_NAME })

        createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS,
            database: DB_NAME
        }).then((connection) => {
            console.debug('[Database] Established MySQL Connection!')

            this.#connection = connection
            this.#connected = true
        })
    }

    execute(query: string, params: Array<any> = []): Promise<any> {
        console.debug('[Database] Preparing query', query, params)

        const result = this.#connection.query(query, params)
        console.debug('[Database] Raw result', result)

        return result
    }

    insert(entity: string, data: object) {
        const id = uuid4()

        const { prepared, params } = makeData(data, { id })

        console.debug(prepared, params)

        return this.execute(
            `INSERT INTO ${ entity } SET ${ prepared }`,
            params
        )
    }

    update(entity: string, findBy: Array<DbQueryCondition>, data: object) {
        const qb = {
            data: makeData(data),
            findBy: makeFindBy(findBy)
        }

        return this.execute(
            `UPDATE ${ entity } SET ${ qb.data.prepared } WHERE ${ qb.findBy.prepared }`,
            [
                ...qb.data.params,
                ...qb.findBy.params
            ]
        )
    }

    getCollection(entity: string, findBy: Array<DbQueryCondition> = []) {
        const { prepared, params } = makeFindBy(findBy)

        if (findBy.length === 0) {
            return this.execute(`SELECT * FROM \`${ entity }\``)
        }

        return this.execute(
            `SELECT * FROM \`${ entity }\` WHERE ${ prepared }`,
            params
        )
    }

    async getEntity(entity: string, findBy: Array<DbQueryCondition>) {
        const collection = await this.getCollection(entity, findBy)

        if (collection.length === 0) {
            return null
        }

        return collection.pop()
    }

    async count(entity: string, findBy: Array<DbQueryCondition>) {
        const { prepared, params } = makeFindBy(findBy)

        const result = await this.execute(
            `SELECT COUNT(id) AS _c FROM \`${ entity }\` WHERE ${ prepared }`,
            params
        )

        return result[0]._c
    }
}
