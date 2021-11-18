import App from "../App"; //This is used instead of Plan because Hashrouter breaks if Links are used outside a router.
import {screen, render} from "@testing-library/react";

describe("Plan", () => {
    beforeEach(async () => {
        render(<App/>);
    });

    it("Should add plans when the add plan button is clicked", async () => {
        expect(screen.queryByTestId("edit-plan")).not.toBeInTheDocument();
        screen.getByTestId("add-plan").click();
        expect(screen.getByTestId("edit-plan")).toBeInTheDocument();
        screen.getByTestId("add-plan").click();
        expect(screen.getAllByTestId("edit-plan")).toHaveLength(2);
    });
    it("Should ask for a confirmation if the user tries to remove a plan", async () => {
        const confirmSpy = jest.spyOn(window,'confirm');
        confirmSpy.mockImplementation(jest.fn<boolean, [string | undefined]>((message?: string) => {
            return true;
        }));
        screen.getByTestId("add-plan").click();
        expect(confirmSpy).not.toHaveBeenCalled();
        screen.getByTestId("delete-plan").click();
        expect(confirmSpy).toHaveBeenCalled();
        expect(screen.queryByTestId("edit-plan")).not.toBeInTheDocument();
    });
    it("Should reroute the user when they click the button to edit a plan", async () => {
        
    });
});