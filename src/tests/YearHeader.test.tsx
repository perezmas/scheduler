import React from "react";
import { screen, render, getByText, waitFor } from "@testing-library/react";
import YearHeader from "../components/Year/YearHeader";

describe(YearHeader, () => {
    const doNothing = jest.fn<void, [void]>();
    const removeYear = jest.fn<void, [void]>();
    it("Should label the year according to its index,", async () => {
        const { rerender } = render(
            <YearHeader clearYear={doNothing} removeYear={removeYear} index={1}>
                <></>
            </YearHeader>
        );
        let label = screen.getByTestId("Year 1 label");
        expect(getByText(label, "Year 1")).toBeInTheDocument();
        rerender(
            <YearHeader clearYear={doNothing} removeYear={removeYear} index={3}>
                <></>
            </YearHeader>
        );
        label = screen.getByTestId("Year 3 label");
        expect(getByText(label, "Year 3")).toBeInTheDocument();
    });

    it("Should call its clearSemesters prop when the clear button is clicked.", async () => {
        const clearSpy = jest.fn<void, [void]>();
        render(
            <YearHeader clearYear={clearSpy} removeYear={removeYear} index={1}>
                <></>
            </YearHeader>
        );

        expect(clearSpy).not.toHaveBeenCalled();
        screen.getByTestId("clear-year 1").click();
        expect(clearSpy).toHaveBeenCalled();
    });
    it("Should call its removeYear prop when the remove button is clicked", async () => {
        const removeYearSpy = jest.fn<void, [void]>();
        render(
            <YearHeader clearYear={doNothing} removeYear={removeYearSpy} index={1}>
                <></>
            </YearHeader>
        );

        expect(removeYearSpy).not.toHaveBeenCalled();
        screen.getByTestId("open-dropdown").click();
        await waitFor(() => {
            expect(screen.queryByTestId("remove-year 1")).toBeInTheDocument();
        });
        screen.getByTestId("remove-year 1").click();
        expect(removeYearSpy).toHaveBeenCalled();
    });
});
