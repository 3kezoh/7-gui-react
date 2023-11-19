import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CRUD } from "../../components";

describe("CRUD", () => {
  it("should be in the document", () => {
    render(<CRUD />);

    const crud = screen.getByTestId("crud");

    expect(crud).toBeInTheDocument();
  });

  it("should create a user", async () => {
    const user = userEvent.setup();

    render(<CRUD />);

    const nameInput = screen.getByLabelText(/^name:/i);
    const surnameInput = screen.getByLabelText(/surname:/i);
    const createButton = screen.getByRole("button", { name: /create/i });

    await user.type(nameInput, "Leone");
    await user.type(surnameInput, "Abbacchio");
    await user.click(createButton);

    const leone = screen.getByRole("button", { name: /leone, abbacchio/i });

    expect(leone).toBeInTheDocument();
  });

  it("should update a user", async () => {
    const user = userEvent.setup();

    const users = [
      {
        id: "64fe0df3-9291-480b-a3b4-bb060d933592",
        name: "Leone",
        surname: "Abbacchio",
      },
      {
        id: "ad8bce6b-b733-40a6-9114-ea69816627d5",
        name: "Gyro",
        surname: "Zepelli",
      },
    ];

    render(<CRUD initialUsers={users} />);

    const nameInput = screen.getByLabelText(/^name:/i);
    const surnameInput = screen.getByLabelText(/surname:/i);
    const updateButton = screen.getByRole("button", { name: /update/i });
    const leone = screen.getByRole("button", { name: /leone, abbacchio/i });

    await user.click(leone);
    await user.clear(nameInput);
    await user.type(nameInput, "Enrico");
    await user.clear(surnameInput);
    await user.type(surnameInput, "Pucci");
    await user.click(updateButton);

    const enrico = screen.getByRole("button", {
      name: /enrico, pucci/i,
    });

    expect(enrico).toBeInTheDocument();
  });

  it("should delete a user", async () => {
    const user = userEvent.setup();

    const users = [
      {
        id: "64fe0df3-9291-480b-a3b4-bb060d933592",
        name: "Leone",
        surname: "Abbacchio",
      },
    ];

    render(<CRUD initialUsers={users} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    const leone = screen.getByRole("button", { name: /leone, abbacchio/i });

    await user.click(leone);
    await user.click(deleteButton);

    expect(leone).not.toBeInTheDocument();
  });

  it("should disable the update and delete buttons when no person is selected.", async () => {
    const users = [
      {
        id: "64fe0df3-9291-480b-a3b4-bb060d933592",
        name: "Leone",
        surname: "Abbacchio",
      },
    ];

    render(<CRUD initialUsers={users} />);

    const updateButton = screen.getByRole("button", { name: /update/i });
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    expect(updateButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it("should unselect a user", async () => {
    const user = userEvent.setup();

    const users = [
      {
        id: "64fe0df3-9291-480b-a3b4-bb060d933592",
        name: "Leone",
        surname: "Abbacchio",
      },
    ];

    render(<CRUD initialUsers={users} />);

    const leone = screen.getByRole("button", {
      name: /leone, abbacchio/i,
    });

    await user.dblClick(leone);

    expect(leone).toHaveClass("bg-white");
  });

  it("should filter users by their surname", async () => {
    const user = userEvent.setup();

    const users = [
      {
        id: "64fe0df3-9291-480b-a3b4-bb060d933592",
        name: "Leone",
        surname: "Abbacchio",
      },
      {
        id: "ad8bce6b-b733-40a6-9114-ea69816627d5",
        name: "Gyro",
        surname: "Zepelli",
      },
      {
        id: "4b3ac0e4-f21a-46f0-93d9-d9ce2dd96f73",
        name: "Enrico",
        surname: "Pucci",
      },
    ];

    render(<CRUD initialUsers={users} />);

    const prefixInput = screen.getByLabelText(/filter prefix:/i);

    await user.type(prefixInput, "Z");

    const filteredUsers = screen.getAllByRole("button", {
      name: /,/,
    });

    expect(filteredUsers).toHaveLength(1);
  });

  it("should match the snapshot", () => {
    const { asFragment } = render(<CRUD />);

    expect(asFragment()).toMatchSnapshot();
  });
});
