import {expect} from "chai";
import * as OneStepWf from "../../tests/apps/one-step-wf";
import {WorkflowFactory} from "../generic/WorkflowFactory";

describe("V1WorkflowModel", () => {
    describe("exposePort", () => {
        it("should add a new input on the workflow and connect it to port", () => {
            const wf = WorkflowFactory.from(OneStepWf.default);

            expect(wf.steps).to.have.length(1);
            expect(wf.inputs).to.have.length(1);
            expect(wf.connections).to.have.length(5);
            wf.exposePort(wf.steps[0].in[1]);

            expect(wf.inputs).to.have.length(2);
            expect(wf.inputs[1].id).to.equal(wf.steps[0].in[1].id);
            expect(wf.connections).to.have.length(6);
        });

        it("should should include in ports after being exposed", () => {
            const wf = WorkflowFactory.from(OneStepWf.default);

            // this will leave a dangling input :/
            wf.exposePort(wf.steps[0].in[1]);
            expect(wf.inputs).to.have.length(2);
            expect(wf.steps[0].in[1].isVisible).to.be.false;
            expect(wf.steps[0].in[1].status).to.equal("exposed");

            wf.includePort(wf.steps[0].in[1]);
            expect(wf.inputs).to.have.length(1);
            expect(wf.steps[0].in[1].isVisible).to.be.true;
            expect(wf.steps[0].in[1].status).to.equal("port");


            wf.exposePort(wf.steps[0].in[1]);
            expect(wf.inputs).to.have.length(2);
            expect(wf.steps[0].in[1].isVisible).to.be.false;
            expect(wf.steps[0].in[1].status).to.equal("exposed");

        });
    });

    describe("includePort", () => {
        it("should set port to visible", () => {
            const wf = WorkflowFactory.from(OneStepWf.default);

            expect(wf.steps[0].in[1].isVisible).to.be.false;
            expect(wf.steps[0].in[1].status).to.equal("editable");

            wf.includePort(wf.steps[0].in[1]);

            expect(wf.steps[0].in[1].isVisible).to.be.true;
            expect(wf.steps[0].in[1].status).to.equal("port");

        });
    });

    describe("clearPort", () => {
       it("should set port to invisible", () => {
           const wf = WorkflowFactory.from(OneStepWf.default);

           expect(wf.connections).to.have.length(5);

           wf.clearPort(wf.steps[0].in[0]);
           expect(wf.connections).to.have.length(4);

       });

       it("should remove connections with this port", () => {
           const wf = WorkflowFactory.from(OneStepWf.default);

           expect(wf.steps[0].in[0].isVisible).to.be.true;
           wf.clearPort(wf.steps[0].in[0]);
           expect(wf.steps[0].in[0].isVisible).to.be.false;
       });

        it("should remove connected input on cleared port if input has no connection", () => {
            const wf = WorkflowFactory.from(OneStepWf.default);

            expect(wf.steps[0].in[0].isVisible).to.be.true;
            expect(wf.inputs).to.have.length(1);
            expect(wf.steps[0].in[0].status).to.equal("port");

            wf.clearPort(wf.steps[0].in[0]);
            expect(wf.steps[0].in[0].status).to.equal("editable");
            expect(wf.inputs).to.have.length(0);
        });
    });
});