import {screen, render, getByText} from "@testing-library/react";
import { isVoidExpression } from "typescript";
import YearHeader from "../components/Year/YearHeader";

describe(YearHeader, () => {
    const doNothing = jest.fn<void, [void]>();
    it("Should label the year according to its index,", async () => {
        const {rerender} = render(<YearHeader
            clearSemesters={doNothing}
            index={1}
        >
            <></>
        </YearHeader>);
        let label = screen.getByTestId("Year 1 label");
        expect(getByText(label, "Year 1 >")).toBeInTheDocument();
        rerender(<YearHeader
            clearSemesters={doNothing}
            index={3}
        >
            <></>
        </YearHeader>);
        label = screen.getByTestId("Year 5 label");
        expect(getByText(label, "Year 5 >")).toBeInTheDocument();
    });

    it("Should call its clearSemesters prop when the clear button is clicked.", async () => {
        const clearSpy = jest.fn<void, [void]>();
        render(<YearHeader
            clearSemesters={clearSpy}
            index={1}
        >
            <></>
        </YearHeader>);

        expect(clearSpy).not.toHaveBeenCalled();
        screen.getByTestId("clear-year 1").click();
        expect(clearSpy).toHaveBeenCalled();
    });
});