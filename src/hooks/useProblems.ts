import { useReducer } from "react";

/**An error or warning within a form that the user is filling out.*/
export interface Problem{
    /**Whether or not this problem will stop the user from submitting the form.*/
    error: boolean,
    /**The message that is displayed to the user when this problem occurs. Also used internally to determine the cause of problems and find if they need to be removed.*/
    message: string
    /**The object where the error was generated (e.g. a form where the user has entered invalid data) */
    source: string
    /**The nature of the problem; can be used to check if a paricular error is present. */
    problemType: string
}

interface AbstractProblemAction{
    type:  "ADD" | "CLEAR" | "RESOLVE-TYPE"
}

interface ResolveProblemAction extends AbstractProblemAction{
    type: "RESOLVE-TYPE",
    target: string
}

interface AddProblemAction extends AbstractProblemAction{
    type: "ADD",
    problem: Problem
}

interface ClearProblemAction extends AbstractProblemAction{
    type: "CLEAR",
    source: string,
}

type ProblemAction<T extends "RESOLVE-TYPE" | "ADD" | "CLEAR"> = 
T extends "RESOLVE-TYPE" ? ResolveProblemAction : 
T extends "ADD" ? AddProblemAction : 
T extends "CLEAR" ? ClearProblemAction : 
AbstractProblemAction; 

function problemReducer<T extends "RESOLVE-TYPE" | "ADD" | "CLEAR">(prev: Array<Problem>, action: ProblemAction<T>): Array<Problem>{
    const newState: Array<Problem> = prev.map((value: Problem) => {
        return {error: value.error, message: value.message, source: value.source, problemType: value.problemType};
    });
    switch(action.type){
    case "RESOLVE-TYPE": {
        const realAction = action as ResolveProblemAction;
        for(let i = 0; i < newState.length; i++){
            if(newState[i].problemType === realAction.target){
                newState.splice(i,1);
            }
        }
        return newState;
    }case "ADD": {
        const realAction = action as AddProblemAction;
        newState.push(realAction.problem);
        return newState;
    }case "CLEAR": {
        const realAction = action as ClearProblemAction;
        const output: Array<Problem> = new Array<Problem>();
        for(let i = 0;i < newState.length; i++){
            if(newState[i].source !== realAction.source){
                output.push(newState[i]);
            }
        }
        return output;
    }
    }
}

/**Contains a state object and some convenience functions that interact with it through reduceProblem.*/
export interface ProblemsInterface{
    /**Contains the current list of problems*/
    value: Array<Problem>,
    /**Resolves the problem with the desired type. */
    resolve: (target: string) => void
    /**Adds a problem to the current list of problems. */
    add: (problem: Problem) => void,
    /**Removes all problems with the source matching the input. */
    clear: (source: string) => void
}

function initializer(): Array<Problem>{
    return new Array<Problem>();
}

/**Returns a ProblemsInterface to track, create, and remove problems caused by the user interacting with the site in an unexpected way (see above for usage). */
export default function useProblems(): ProblemsInterface{
    const [output, dispatchOutput] = useReducer(problemReducer,undefined,initializer);

    const resolve = (target: string) => {
        dispatchOutput({type: "RESOLVE-TYPE", target: target});
    };

    const add = (problem: Problem) => {
        dispatchOutput({type: "ADD", problem: problem});
    };

    const clear = (source: string) => {
        dispatchOutput({type: "CLEAR", source: source});
    };

    return {add, resolve, clear, value: output};
}