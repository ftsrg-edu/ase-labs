package hu.bme.mit.ase.shingler.workflow.lib;

import java.util.concurrent.TimeoutException;

public abstract class Worker<T> extends Thread {

    public final Pin<T> outputPin = new Pin<>();

    @Override
    public void run() {
        try {
            var result = computeResult();
            outputPin.setValue(result);
        } catch (InterruptedException e) {
            interrupt();
        } catch (TimeoutException e) {
            throw new RuntimeException(e);
        }
    }

    protected abstract T computeResult() throws InterruptedException, TimeoutException;

}
