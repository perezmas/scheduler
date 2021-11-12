import React from "react";
import { Problem } from "../hooks/useProblems";
import ReactDOM from "react-dom";

interface ErrorStackProps{
    problems: Array<Problem> | null;
}

//This component is a stack that displays warnings and errors when the user enters inputs that could cause problems or are otherwise strange and likely to be an accident, e.g. a semester that is only a week long.
export default function ErrorStack(props: ErrorStackProps): JSX.Element{
    if(props.problems !== null){
        const ctr = [<div className="error-counter" key={0}>
            {props.problems.length} {props.problems.length === 1 ? "error" : "errors"}
        </div>];
        return ReactDOM.createPortal(
            <div className="error-stack-container">
                <div className="error-stack">
                    {ctr.concat(props.problems.map((problem: Problem, index: number) => {
                        return (
                            <span className={problem.error ? "error" : "warning"} key={index+1} data-testid={problem.error ? "error" : "warning"}>
                                {problem.message}
                            </span>
                        );
                    }))}
                </div>

            </div>,document.body);
    }else{
        return <span data-testid="no-errors"/>;
    }

}