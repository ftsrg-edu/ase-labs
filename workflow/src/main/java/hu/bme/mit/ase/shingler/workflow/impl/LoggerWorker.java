package hu.bme.mit.ase.shingler.workflow.impl;

import hu.bme.mit.ase.shingler.workflow.lib.Pin;
import hu.bme.mit.ase.shingler.workflow.lib.Worker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeoutException;

public class LoggerWorker<T> extends Worker<T> {

    private final Logger logger = LoggerFactory.getLogger(LoggerWorker.class);

    public final Pin<T> inputPin = new Pin<>();

    @Override
    protected T computeResult() throws InterruptedException, TimeoutException {
        var value = inputPin.getValue();
        logger.info("Value got: {}", value);
        return value;
    }

}
