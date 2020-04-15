import { DbQueryCondition, DbQueryConditionType, QB_CONDITIONS } from './Database'

export function makeFindBy(findBy: Array<DbQueryCondition>) {
    const
        _conditions = [],
        params = []

    findBy.forEach((queryCondition: DbQueryCondition) => {
        let { column, value, condition } = queryCondition
        if (undefined === condition) {
            condition = DbQueryConditionType.EQ
        }

        let _condName = Object.keys(DbQueryConditionType).filter(ct => DbQueryConditionType[ct] === condition)

        if (!_condName) {
            throw new Error('Jesus is watching you.')
        }

        _conditions.push(`${ column } ${ QB_CONDITIONS[_condName.pop()] } ?`)
        if (DbQueryConditionType.LIKE === condition) {
            params.push(`%${ value }%`)
        } else {
            params.push(value)
        }
    })

    return {
        prepared: _conditions.join(', '),
        params
    }
}

export function makeData(data: object, before?: object) {
    const _toHandle = {
        ...before,
        ...data
    }

    const
        _query = [],
        params = []

    Object.keys(_toHandle).forEach(column => {
        // TODO make a TableData mapping so we can properly set data types
        _query.push(`\`${ column }\` = ?`)
        params.push(_toHandle[column])
    })

    return {
        prepared: _query.join(', '),
        params
    }
}
