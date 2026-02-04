import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { CRUD } from "@/components";

describe("CRUD", () => {
	it("should be in the document", async () => {
		const screen = await render(<CRUD />);

		const crud = screen.getByTestId("crud");

		expect(crud).toBeInTheDocument();
	});

	it("should create a user", async () => {
		const screen = await render(<CRUD />);

		const nameInput = screen.getByLabelText(/^name:/i);
		const surnameInput = screen.getByLabelText(/surname:/i);
		const createButton = screen.getByRole("button", { name: /create/i });

		await userEvent.fill(nameInput, "Leone");
		await userEvent.fill(surnameInput, "Abbacchio");
		await userEvent.click(createButton);

		const leone = screen.getByRole("button", { name: /leone, abbacchio/i });

		expect(leone).toBeInTheDocument();
	});

	it("should update a user", async () => {
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

		const screen = await render(<CRUD initialUsers={users} />);
		const nameInput = screen.getByLabelText(/^name:/i);
		const surnameInput = screen.getByLabelText(/surname:/i);
		const updateButton = screen.getByRole("button", { name: /update/i });
		const leone = screen.getByRole("button", { name: /leone, abbacchio/i });

		await userEvent.click(leone);
		await userEvent.fill(nameInput, "Enrico");
		await userEvent.fill(surnameInput, "Pucci");
		await userEvent.click(updateButton);

		const enrico = screen.getByRole("button", {
			name: /enrico, pucci/i,
		});

		expect(enrico).toBeInTheDocument();
	});

	it("should delete a user", async () => {
		const users = [
			{
				id: "64fe0df3-9291-480b-a3b4-bb060d933592",
				name: "Leone",
				surname: "Abbacchio",
			},
		];

		const screen = await render(<CRUD initialUsers={users} />);
		const deleteButton = screen.getByRole("button", { name: /delete/i });
		const leone = screen.getByRole("button", { name: /leone, abbacchio/i });

		await userEvent.click(leone);
		await userEvent.click(deleteButton);

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

		const screen = await render(<CRUD initialUsers={users} />);
		const updateButton = screen.getByRole("button", { name: /update/i });
		const deleteButton = screen.getByRole("button", { name: /delete/i });

		expect(updateButton).toBeDisabled();
		expect(deleteButton).toBeDisabled();
	});

	it("should unselect a user", async () => {
		const users = [
			{
				id: "64fe0df3-9291-480b-a3b4-bb060d933592",
				name: "Leone",
				surname: "Abbacchio",
			},
		];

		const screen = await render(<CRUD initialUsers={users} />);

		const leone = screen.getByRole("button", {
			name: /leone, abbacchio/i,
		});

		await userEvent.dblClick(leone);

		expect(leone).toHaveClass("bg-white");
	});

	it("should filter users by their surname", async () => {
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

		const screen = await render(<CRUD initialUsers={users} />);
		const prefixInput = screen.getByLabelText(/filter prefix:/i);

		await userEvent.fill(prefixInput, "Z");

		const filteredUsers = screen
			.getByRole("button", {
				name: /,/,
			})
			.all();

		expect(filteredUsers).toHaveLength(1);
	});
});
