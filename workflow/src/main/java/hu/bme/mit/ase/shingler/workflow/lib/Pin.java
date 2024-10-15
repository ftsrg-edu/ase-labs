package hu.bme.mit.ase.shingler.workflow.lib;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public class Pin<T> {

    private T value = null;
    private final CountDownLatch latch = new CountDownLatch(1);

    public T getValue() throws InterruptedException, TimeoutException {
        var timedOut = !latch.await(100, TimeUnit.MILLISECONDS);
        if (timedOut) {
            throw new TimeoutException("Timed out after waiting for 100ms!");
        }
        return value;
    }

    public void setValue(T value) {
        this.value = value;
        latch.countDown();
    }

}
