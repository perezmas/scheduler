import React from "react";
import {screen, render} from "@testing-library/react";
import FormTrigger from "../components/Year/FormTrigger";
import {v4 as uuid} from "uuid";

describe(FormTrigger,() => {
    const doNothingWithString = jest.fn<void, [string | null]>();
    it("Should render the button to open the popup, but not the popup itself if the currentForm is null.", async () => {
        render(<FormTrigger
            currentForm={null}
            setForm={doNothingWithString}
            YearUuid={uuid()}
        ><div>I should be hidden</div>
        </FormTrigger>);
        expect(screen.getByTestId("open-semester-form")).toBeInTheDocument();
        expect(screen.queryByText("I should be hidden")).not.toBeInTheDocument();
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
        ><div>I should not be hidden</div>
        </FormTrigger>
        );

        const popover = await screen.findByTestId("popover");
        expect(popover).toContainElement(screen.getByText("I should not be hidden"));
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