import { useReducer } from "react";

/**An error or warning within a form that the user is filling out.*/
export interface Problem{
    /**Whether or not this problem will stop the user from submitting the form.*/
    error: boolean,
    /**The message that is displayed to the user when this problem occurs. Also used internally to determine the cause of problems and find if they need to be removed.*/
    message: string

    source: string

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

function problemReducer(prev: Array<Problem>, action: AbstractProblemAction): Array<Problem>{
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
    default:
        throw Error(`${action.type} not implemented!`);
    }
}

/**Contains a state object and some convenience functions that interact with it through reduceProblem.*/
interface ProblemsInterface{
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

export default function useProblems(): ProblemsInterface{
    const [output, dispatchOutput] = useReducer(problemReducer,undefined,initializer);

    const resolve = (target: string) => {
        const action: ResolveProblemAction = {type: "RESOLVE-TYPE", target: target};
        dispatchOutput(action);
    };

    const add = (problem: Problem) => {
        const action: AddProblemAction = {type: "ADD", problem: problem};
        dispatchOutput(action);
    };

    const clear = (source: string) => {
        const action: ClearProblemAction = {type: "CLEAR", source: source};
        dispatchOutput(action);
    };

    return {add: add, resolve: resolve, clear: clear, value: output};


}