package hu.bme.mit.ase.shingler.workflow.impl;

import hu.bme.mit.ase.shingler.lib.OccurrenceVectorComputor;
import hu.bme.mit.ase.shingler.lib.data.OccurrenceVector;
import hu.bme.mit.ase.shingler.lib.data.TokenizedDocument;
import hu.bme.mit.ase.shingler.logic.BaseOccurrenceVectorComputor;
import hu.bme.mit.ase.shingler.workflow.lib.Pin;
import hu.bme.mit.ase.shingler.workflow.lib.Worker;

import java.util.concurrent.TimeoutException;

public class ShinglerWorker extends Worker<OccurrenceVector> {

    private final int size;

    private final OccurrenceVectorComputor occurrenceVectorComputor = new BaseOccurrenceVectorComputor();

    public final Pin<TokenizedDocument> inputPin = new Pin<>();

    public ShinglerWorker(int size) {
        this.size = size;
    }

    @Override
    protected OccurrenceVector computeResult() throws InterruptedException, TimeoutException {
        return occurrenceVectorComputor.calculateOccurrenceVector(inputPin.getValue(), size);
    }

}
