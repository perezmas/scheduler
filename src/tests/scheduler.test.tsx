import React from "react";
import { fireEvent, render, screen, waitFor} from "@testing-library/react";
import App from "../App";
import { act, } from "react-dom/test-utils";

async function addSemester(name: string, start: string, end: string): Promise<void>{
    screen.getByTestId("trigger 1").click();
    let form = await screen.findByTestId("semester-form 1");

    expect(form).toBeInTheDocument();
    
    let seasonBox = screen.getByTestId("season-input");
    let startBox = screen.getByTestId("starts-input");
    let endBox = screen.getByTestId("ends-input");
    
    fireEvent.change(seasonBox,{target: {value: name}});
    fireEvent.change(startBox,{target: {value: start}});
    fireEvent.change(endBox,{target: {value: end}});

    let submit = screen.getByTestId("submit-button");
    submit.click();

    await waitFor(() => {
        expect(screen.queryByTestId("semester-form 1")).not.toBeInTheDocument();
    });
}

describe("Scheduler", () => {
    beforeEach(() => {
        render(<App/>);
    });

    it("Starts with one year and a button to add more",async () => {
        const yrs = screen.getAllByTestId("Year");
        expect(yrs).toHaveLength(1);
        expect(yrs[0]).toBeInstanceOf(HTMLDivElement);
        const btn = screen.getByTestId("addYearButton");
        expect(btn).toBeInTheDocument();
        expect(btn).toBeInstanceOf(HTMLButtonElement);
    });

    it("Can add another year by pressing the button", async () => {
        let btn = screen.getByTestId("addYearButton");
        btn.click();
        let yrs = screen.getAllByTestId("Year");
        expect(yrs).toHaveLength(2);
        for(let i = 0;i < 5;i++){
            btn = screen.getByTestId("addYearButton");
            expect(btn).toBeInTheDocument();
            btn.click();
        }
        yrs = screen.getAllByTestId("Year");
        expect(yrs).toHaveLength(7);
    });

    it("renders a form when you click on the new semester button",async () => {
        screen.getByTestId("Year 1 label").click();
        screen.getByTestId("trigger 1").click();

        const form = await screen.findByTestId("semester-form 1");
        const seasonBox = screen.getByTestId("season-input");
        const startBox = screen.getByTestId("starts-input");
        const endBox = screen.getByTestId("ends-input");

        expect(form).toBeInTheDocument();
        expect(seasonBox).toBeInTheDocument();
        expect(startBox).toBeInTheDocument();
        expect(endBox).toBeInTheDocument();

        act(() => {
            screen.getByTestId("trigger 1").click();
        });

        await waitFor(() => {
            expect(screen.queryByTestId("semester-form 1")).not.toBeInTheDocument();
        });

    });

    it("Can display the names of semesters you add to a year.", async () => {
        expect(screen.queryByText("fall")).not.toBeInTheDocument();
        screen.getByTestId("Year 1 label").click();
        screen.getByTestId("trigger 1").click();
        const form = await screen.findByTestId("semester-form 1");

        expect(form).toBeInTheDocument();

        const seasonBox = screen.getByTestId("season-input");
        const startBox = screen.getByTestId("starts-input");
        const endBox = screen.getByTestId("ends-input");
        
        fireEvent.change(seasonBox,{target: {value: "fall"}});
        fireEvent.change(startBox,{target: {value: "2021-09-01"}});
        fireEvent.change(endBox,{target: {value: "2021-12-15"}});

        const submit = screen.getByTestId("submit-button");
        submit.click();

        expect(screen.getByText("fall")).toBeInTheDocument();
    });

    it("Should sort semesters by starting dates", async () => {

        screen.getByTestId("Year 1 label").click();

        await addSemester("summer 2","2022-07-11", "2022-08-12");
        await addSemester("spring", "2022-02-07","2022-05-26");
        await addSemester("winter","2022-01-03","2022-02-05");
        await addSemester("fall","2021-08-31","2021-12-18");
        await addSemester("summer 1", "2022-06-06", "2022-07-28");

        const fall = screen.getByText("fall");
        const winter = screen.getByText("winter");
        const spring = screen.getByText("spring");
        const summer1 = screen.getByText("summer 1");
        const summer2 = screen.getByText("summer 2");

        const fallCol = screen.getByTestId("Year 1 semester 1");
        const winterCol = screen.getByTestId("Year 1 semester 2");
        const springCol = screen.getByTestId("Year 1 semester 3");
        const summer1Col = screen.getByTestId("Year 1 semester 4");
        const summer2Col = screen.getByTestId("Year 1 semester 5");

        expect(fallCol).toBe(fall);
        expect(winterCol).toBe(winter);
        expect(springCol).toBe(spring);
        expect(summer1Col).toBe(summer1);
        expect(summer2Col).toBe(summer2);
        
    });
});

