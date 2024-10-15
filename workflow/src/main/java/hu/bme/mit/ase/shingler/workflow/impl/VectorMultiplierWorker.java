package hu.bme.mit.ase.shingler.workflow.impl;

import hu.bme.mit.ase.shingler.lib.VectorMultiplier;
import hu.bme.mit.ase.shingler.lib.data.OccurrenceVector;
import hu.bme.mit.ase.shingler.logic.BaseVectorMultiplier;
import hu.bme.mit.ase.shingler.workflow.lib.Pin;
import hu.bme.mit.ase.shingler.workflow.lib.Worker;

import java.util.concurrent.TimeoutException;

public class VectorMultiplierWorker extends Worker<Double> {

    private final VectorMultiplier vectorMultiplier = new BaseVectorMultiplier();

    public final Pin<OccurrenceVector> aPin = new Pin<>();
    public final Pin<OccurrenceVector> bPin = new Pin<>();

    @Override
    protected Double computeResult() throws InterruptedException, TimeoutException {
        return vectorMultiplier.computeScalarProduct(aPin.getValue(), bPin.getValue());
    }

}
