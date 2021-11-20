import Requirements from "../components/Requirements";
import React from "react";
import {screen, render, fireEvent} from "@testing-library/react";
import {
    Route,
    HashRouter,
    RouteComponentProps
} from "react-router-dom";
import { Switch } from "react-router-dom";
interface RequirementsTestProps{
    requirements: string[],
    onAddRequirement: (requirement: string) => void,
    onRemoveRequirement: (requirement: string) => void
}

function RequirementsTester(props: RequirementsTestProps): JSX.Element{
    return (
        <HashRouter>
            <Switch>
                <Route path="/" render={(routeProps: RouteComponentProps) => {
                    return <Requirements {...props} {...routeProps}/>;
                }}/>
            </Switch>
        </HashRouter>
    );
}

describe(Requirements, () => {
    const doNothingWithString = jest.fn<void, [string]>();
    it("Displays the requirements provided to it", async () => {
        const {rerender} = render(<RequirementsTester
            requirements={["CISC123", "CISC124"]}
            onAddRequirement={doNothingWithString}
            onRemoveRequirement={doNothingWithString}
        />);
        expect(screen.getByText("CISC123")).toBeInTheDocument();
        expect(screen.getByText("CISC124")).toBeInTheDocument();

        rerender(<RequirementsTester
            requirements={["CISC123"]}
            onAddRequirement={doNothingWithString}
            onRemoveRequirement={doNothingWithString}
        />);
        expect(screen.getByText("CISC123")).toBeInTheDocument();
        expect(screen.queryByTestId("CISC124")).not.toBeInTheDocument();
    });

    it("Calls onAddRequirement if the button to add a new requirement is clicked", async () => {
        const onAddRequirementSpy = jest.fn<void, [string]>();
        render(<RequirementsTester 
            requirements={[]}
            onAddRequirement={onAddRequirementSpy}
            onRemoveRequirement={doNothingWithString}
        />);

        fireEvent.change(screen.getByTitle("requirement-input"), {target: {value: "CISC123"}});
        expect(onAddRequirementSpy).not.toHaveBeenCalled();
        screen.getByTestId("submit-requirement").click();
        expect(onAddRequirementSpy).toHaveBeenCalled();
        expect(onAddRequirementSpy).toHaveBeenLastCalledWith("CISC123");
    });

    it("Calls onRemoveRequirement if the button to remove the requirement is clicked", async () => {
        const onRemoveRequirementSpy = jest.fn<void, [string]>();
        render(<RequirementsTester
            requirements={["CISC123"]}
            onAddRequirement={doNothingWithString}
            onRemoveRequirement={onRemoveRequirementSpy}
        />);

        expect(onRemoveRequirementSpy).not.toHaveBeenCalled();
        screen.getByTestId("remove-requirement").click();
        expect(onRemoveRequirementSpy).toHaveBeenCalled();
        expect(onRemoveRequirementSpy).toHaveBeenLastCalledWith("CISC123");
    });
});