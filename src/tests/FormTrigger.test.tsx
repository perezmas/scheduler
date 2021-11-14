import React from "react";
import {screen, render, waitFor} from "@testing-library/react";
import FormTrigger from "../components/Year/FormTrigger";
import {v4 as uuid} from "uuid";
import renderer from "react-test-renderer"

describe(FormTrigger, async () => {
    const doNothingWithString = jest.fn<void, [string | null]>();
    it("Should only render a button if currentForm is null", async () => {
        const tree = renderer.create(<FormTrigger
        currentForm={null}
        setForm={doNothingWithString}
        YearUuid={uuid()}
            ><div>I should be hidden</div>
        </FormTrigger>).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("Should be the same no matter what currentForm is as long as it is not YearUuid", async () => {
        const {rerender} = render(<FormTrigger
            currentForm={null}
            setForm={doNothingWithString}
            YearUuid={uuid()}
                ><div>I should be hidden</div>
            </FormTrigger>);

        const html = screen.getByTestId("form-trigger").innerHTML;
        rerender(<FormTrigger
            currentForm={"x"}
            setForm={doNothingWithString}
            YearUuid={uuid()}
                ><div>I should be hidden</div>
            </FormTrigger>
        );
        expect(screen.getByTestId("form-trigger")).toContainHTML(html);
    });
    it("Should open its child in a popover if currentForm matches YearUuid", async () => {
        const YearUuid = uuid();
        render(<FormTrigger
            currentForm={YearUuid}
            setForm={doNothingWithString}
            YearUuid={YearUuid}
                ><div>I shouldn't be hidden</div>
            </FormTrigger>
        );

        const popover = await screen.findByTestId("popover");
        expect(popover).toContainElement(screen.getByText("I shouldn't be hidden"));
    });

    it("Should call setForm with YearUuid as the argument if the open-semester-form button is clicked", async () => {
        const YearUuid = uuid();
        const setFormSpy = jest.fn<void, [string | null]>();
        render(<FormTrigger
            currentForm={null}
            setForm={setFormSpy}
            YearUuid={YearUuid}
                ><div>I should be hidden</div>
            </FormTrigger>
        );
        expect(setFormSpy).not.toHaveBeenCalled();
        screen.getByTestId("open-semester-form").click();
        expect(setFormSpy).toHaveBeenCalled();
        expect(setFormSpy).toHaveBeenLastCalledWith(YearUuid);
    });
    it("Should call setForm with null as the argument if the open-semester-form button is pressed while the form is open.", async () => {
        const setFormSpy = jest.fn<void, [string | null]>();
        const YearUuid = uuid();
        render(<FormTrigger
            currentForm={YearUuid}
            setForm={setFormSpy}
            YearUuid={YearUuid}
                ><div>I should be hidden</div>
            </FormTrigger>
        );
        await screen.findByTestId("popover");
        expect(setFormSpy).not.toHaveBeenCalled();
        screen.getByTestId("open-semester-form").click();
        expect(setFormSpy).toHaveBeenCalled();
        expect(setFormSpy).toHaveBeenLastCalledWith(null);
    });

});