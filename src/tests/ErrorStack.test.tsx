import React from "react";
import ErrorStack from "../components/ErrorStack";
import {render, screen} from "@testing-library/react";
import {Problem} from "../hooks/useProblems";

describe(ErrorStack,() => {
    it("Should do nothing if the problems prop is null.", async () => {
        render(<ErrorStack
            problems={null}
        />);
        expect(screen.getByTestId("no-errors")).toBeInTheDocument();
        expect(screen.queryByText("0 errors")).not.toBeInTheDocument();
    });

    it("Should display an error counter if the problems prop is an empty list.", async () => {
        render(<ErrorStack
            problems={[]}    
        />);
        expect(screen.getByText("0 errors")).toBeInTheDocument();
    });

    it("Should show an error if a problem with the error field is true is present", async () => {
        render(<ErrorStack
            problems={[{problemType: "type", message: "test message", source: "test", error: true}]}
        />);

        expect(screen.getByText("test message")).toBeInTheDocument();
        expect(screen.getByTestId("error")).toBeInTheDocument();
        expect(screen.queryByTestId("warning")).not.toBeInTheDocument();
    });

    it("Should show a warning if a problem with the error field is false is present", async () => {
        render(<ErrorStack
            problems={[{problemType: "type", message: "test message", source: "test", error: false}]}
        />);

        expect(screen.getByText("test message")).toBeInTheDocument();
        expect(screen.getByTestId("warning")).toBeInTheDocument();
        expect(screen.queryByTestId("error")).not.toBeInTheDocument();
    });

    it("Should be able to display multiple errors and warnings", async () => {
        render(<ErrorStack
            problems={[{problemType: "type", message: "test message 1", source: "test", error: true},{problemType: "type2", message: "test message 2", source: "test", error: false},{problemType: "type3", message: "test message 3", source: "test", error: true}]}
        />);

        expect(screen.getByText("test message 1")).toBeInTheDocument();
        expect(screen.getByText("test message 2")).toBeInTheDocument();
        expect(screen.getByText("test message 3")).toBeInTheDocument();

        expect(screen.getAllByTestId("error")).toHaveLength(2);
        expect(screen.getByTestId("warning")).toBeInTheDocument();
    });

    it("Should update the error counter depending on the number of errors.", async () => {
        const problems: Array<Problem> = [{problemType: "type", message: "test message", source: "test", error: false}];
        const {rerender} = render(<ErrorStack
            problems={problems}  
        />);

        expect(screen.getByText("1 error")).toBeInTheDocument();

        problems.push({problemType: "type", message: "test message 2", source: "test", error: false});
        rerender(<ErrorStack
            problems={problems}
        />);

        expect(screen.getByText("2 errors")).toBeInTheDocument();

        problems.push({problemType: "type", message: "test message 3", source: "test", error: true});

        rerender(<ErrorStack
            problems={problems}
        />);

        expect(screen.getByText("3 errors")).toBeInTheDocument();
    });
});