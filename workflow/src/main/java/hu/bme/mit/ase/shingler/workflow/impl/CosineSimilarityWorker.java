package hu.bme.mit.ase.shingler.workflow.impl;

import hu.bme.mit.ase.shingler.lib.CosineSimilarityComputor;
import hu.bme.mit.ase.shingler.logic.BaseCosineSimilarityComputor;
import hu.bme.mit.ase.shingler.workflow.lib.Pin;
import hu.bme.mit.ase.shingler.workflow.lib.Worker;

import java.util.concurrent.TimeoutException;

public class CosineSimilarityWorker extends Worker<Double> {

    private final CosineSimilarityComputor cosineSimilarityComputor = new BaseCosineSimilarityComputor();

    public final Pin<Double> aaPin = new Pin<>();
    public final Pin<Double> abPin = new Pin<>();
    public final Pin<Double> bbPin = new Pin<>();

    @Override
    protected Double computeResult() throws InterruptedException, TimeoutException {
        return cosineSimilarityComputor.computeCosineSimilarity(aaPin.getValue(), abPin.getValue(), bbPin.getValue());
    }

}
