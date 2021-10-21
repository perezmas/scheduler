import React from "react";
import { render, screen} from "@testing-library/react";
import { Scheduler } from "./components/Scheduler";

describe("Scheduler", () => {
    beforeEach(() => {
        render(<Scheduler></Scheduler>);
    });

    it("Starts with one year and a button to add more", () => {
        const yrs = screen.getAllByTestId("Year");
        expect(yrs.length).toBe(1);
        const btn = screen.getByTestId("addYearButton");
        expect(btn).toBeInTheDocument();
    });

    it("Can add another year by pressing the button", () => {
        let btn = screen.getByTestId("addYearButton");
        btn.click();
        let yrs = screen.getAllByTestId("Year");
        expect(yrs.length).toBe(2);
        for(let i = 0;i < 5;i++){
            btn = screen.getByTestId("addYearButton");
            expect(btn).toBeInTheDocument();
            btn.click();
        }
        yrs = screen.getAllByTestId("Year");
        expect(yrs.length).toBe(7);
    });

    it("Can expand and collapse each year", () => {
        let semesterPlus = screen.getByTestId("trigger");
        expect(semesterPlus).not.toBeVisible();
        const yr = screen.getByTestId("Year 1 label");
        yr.click();
        semesterPlus = screen.getByTestId("trigger");
        expect(semesterPlus).toBeVisible();


    });

});
