import { useState } from "react";

export type Identifiable = {
  id: string;
};

export function useCRUD<T extends Identifiable>(
  initialEntities: readonly T[] = [],
) {
  const [entities, setEntities] = useState(initialEntities);

  function create(payload: Omit<T, "id">) {
    const entity = { ...payload, id: crypto.randomUUID() } as T;

    setEntities([...entities, entity]);
  }

  function update(payload: T) {
    setEntities(
      entities.map((entity) => {
        if (entity.id === payload.id) {
          return payload;
        }

        return entity;
      }),
    );
  }

  function remove(payload: Identifiable["id"]) {
    setEntities(entities.filter(({ id }) => id !== payload));
  }

  return [entities, { create, update, remove }] as const;
}
