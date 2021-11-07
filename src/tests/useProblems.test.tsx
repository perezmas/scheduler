import { getByText, getByTestId, render, screen } from "@testing-library/react";
import React, {useState} from "react";
import useProblems, {Problem} from "../hooks/useProblems";
import {v4 as uuid} from "uuid";
interface HookTesterProps {
    testIndex: number
}

/**Contains a state object and some convenience functions that interact with it through reduceProblem.*/
interface ProblemsInterface{
    /**Contains the current problem and the backlog of problems. */
    value: Array<Problem>,
    /**Resolves the problem in the backlog with the uuid matching the target argument. */
    resolve: (target: string) => void,
    resolveByKey: (target: string) => void
    /**Adds a problem to the backlog. If current is empty, this will be put in the current field instead. Problems with error=true will be prioritized for the current field. */
    add: (problem: Problem) => void,
    /**Sets the current problem to null and empties the backlog. */
    clear: (source: string) => void
}

function UseProblemsTest(props: HookTesterProps): JSX.Element{
    let problems = useProblems();
    switch(props.testIndex){
        case 1: {
            break;
        }case 2: {
            const [add, setAdd] = useState(true);
            if(add){
                problems.add({error: true, message: "test", source: "test-source", problemType: "test-type"});
                setAdd(false);
            }
            break;
        }case 3:{
            const [resolve, setResolve] = useState(false);
            const [add, setAdd] = useState(true);
            if(add){
                problems.add({error: true, message: "test", source: "test-source", problemType: "test-type"});
                problems.add({error: true, message: "test", source: "test-source", problemType: "test-type-2"});
                setAdd(false);
                setResolve(true);
            }
            if(resolve){
                problems.resolve("test-type");
                setResolve(false);
            }
            break;
        }case 4: {
            const [clear, setClear] = useState(false);
            const [add, setAdd] = useState(true);
            if(add){
                problems.add({error: true, message: "test", source: "test-source", problemType: "test-type"});
                problems.add({error: false, message: "test-message 2", source: "test-source", problemType: "test-type-2"});
                problems.add({error: true, message: "test", source: "test-source 2", problemType: "test-type-3"});
                setAdd(false);
                setClear(true);
            }
            if(clear){
                problems.clear("test-source");
                setClear(false);
            }
            break;
        }
        default:
            throw Error(`Unimplemented test ${props.testIndex}`);
    }
    return (
        <div>
            {problems.value.map((problem: Problem, index: number) => {
                return (<div data-testid={`Problem ${index}`} key={index}>
                    <MockProblem {...problem}/>
                </div>);
            })}
            <div data-testid="problems-length">
                {problems.value.length}
            </div>
        </div>
    );
}

function MockProblem(props: Problem): JSX.Element{
    return (<div>
        <div data-testid="problemType">
            {props.problemType}
        </div>
        <div data-testid="error">
            {props.error.toString()}
        </div>
        <div data-testid="message">
            {props.message}
        </div>
        <div data-testid="source">
            {props.source}
        </div>
    </div>);
}

function expectProblems(expected: Array<Problem>): void{
    const ln = screen.getByTestId("problems-length");
    expect(getByText(ln,expected.length)).toBeInTheDocument();

    for(let i = 0; i < expected.length; i++){
        let problem = screen.getByTestId(`Problem ${i}`);
        let entries = Object.entries(expected[i]);
        for(const entry of entries){
            const element = getByTestId(problem, entry[0]);
            expect(getByText(element,entry[1])).toBeInTheDocument();
        }
    }
}

describe(useProblems, () => {
    it("Should initialize to an empty array", async () => {
        render(<UseProblemsTest
            testIndex={1}
        />);

        expectProblems([]);
    });

    it("Should be able to add problems", async () => {
        render(<UseProblemsTest
            testIndex={2}
        />);
        expectProblems([{error: true, message: "test", source: "test-source", problemType: "test-type"}]);
    });

    it("Should be able to remove all problems that share a type", async () => {
        render(<UseProblemsTest
            testIndex={3}
        />);
        expectProblems([{error: true, message: "test", source: "test-source", problemType: "test-type-2"}]);
    });

    it("Should be able to remove all problems from the same source", async () => {
        render(<UseProblemsTest
            testIndex={4}
        />);
        expectProblems([{error: true, message: "test", source: "test-source 2", problemType: "test-type-3"}]);
    })
});