export abstract class Resolver {
	private entiityMap = new Map<string, Map<string, any>>();

	protected makeEntityMap<E>(entities: E[], key: keyof E): Map<string, E>{
		return new Map(entities.map((entity) => [entity[key] as string, entity]));
	}

	protected setEntityMap<E>(name: string, entityMap: Map<string, E>): void {
		this.entiityMap.set(name, entityMap);
	}

	protected getEntityMap<E>(name: string): Map<string, E> {
		return this.entiityMap.get(name);
	}

	protected registerEntityMap<E>(name: string, entities: E[], key: keyof E): void {
		this.setEntityMap(name, this.makeEntityMap(entities, key));
	}

	protected getEntity<E>(name: string, key: string): E {
		return this.getEntityMap<E>(name).get(key);
	}
}
