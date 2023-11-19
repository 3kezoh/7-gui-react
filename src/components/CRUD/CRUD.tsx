import { useState } from "react";
import { Identifiable, useCRUD } from "../../hooks";
import { cn } from "../../utils";
import { Button } from "../Button";
import { Input } from "../Input";

export interface CRUDProps {
  initialUsers?: User[];
}

interface User extends Identifiable {
  name: string;
  surname: string;
}

const initialState = {
  id: "",
  name: "",
  surname: "",
  prefix: "",
};

export function CRUD({ initialUsers = [] }: CRUDProps) {
  const [users, { create, remove, update }] = useCRUD<User>(initialUsers);
  const [state, setState] = useState(initialState);
  const { prefix, ...user } = state;
  const { id, name, surname } = user;

  const filteredUsers = users.filter(({ surname }) =>
    surname.startsWith(prefix),
  );

  function onChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    const { value, name } = target;

    if (name in initialState) {
      setState({ ...state, [name]: value });
    }
  }

  function onSelect(user: User) {
    return () => {
      if (user.id === id) {
        return setState({ ...initialState, prefix });
      }

      setState({ ...state, ...user });
    };
  }

  function onCreate() {
    if (name !== "" && surname !== "") {
      create(user);
      setState({ ...initialState, prefix });
    }
  }

  function onUpdate() {
    update(user);
    setState({ ...initialState, prefix });
  }

  function onDelete() {
    remove(id);
    setState({ ...initialState, prefix });
  }

  const isUpdateAndDeleteDisabled = id === "";

  return (
    <div
      className="grid grid-cols-2 gap-2 w-fit border border-black p-4"
      data-testid="crud"
    >
      <div className="flex gap-2">
        <label htmlFor="prefix">Filter prefix:</label>
        <Input
          name="prefix"
          onChange={onChange}
          value={prefix}
          className="flex-1"
        />
      </div>
      <ul className="row-start-2 m-0 p-0 border border-black">
        {filteredUsers.map((user) => {
          const isSelected = user.id === id;

          const buttonClassName = cn("bg-white px-2 w-full text-left", {
            "text-white bg-blue-500": isSelected,
            "hover:text-white hover:bg-blue-500": !isSelected,
          });

          return (
            <li key={user.id}>
              <button className={buttonClassName} onClick={onSelect(user)}>
                {user.name}, {user.surname}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="row-start-2 grid grid-cols-[max-content_1fr] gap-2 h-fit">
        <label htmlFor="name">Name:</label>
        <Input name="name" onChange={onChange} value={name} />
        <label htmlFor="surname">Surname:</label>
        <Input name="surname" onChange={onChange} value={surname} />
      </div>
      <div className="col-span-2 flex gap-2">
        <Button onClick={onCreate}>Create</Button>
        <Button disabled={isUpdateAndDeleteDisabled} onClick={onUpdate}>
          Update
        </Button>
        <Button disabled={isUpdateAndDeleteDisabled} onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default CRUD;
