package hu.bme.mit.ase.shingler.workflow.lib;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.TimeoutException;

public abstract class Workflow<T> {

    private final Set<Worker<?>> workers = new HashSet<>();
    private final Set<Channel<?>> channels = new HashSet<>();
    private Pin<T> outputPin;

    protected abstract void initialize();

    protected void addWorker(Worker<?> worker) {
        workers.add(worker);
    }

    protected void addChannel(Channel<?> channel) {
        channels.add(channel);
    }

    protected void setOutputPin(Pin<T> outputPin) {
        this.outputPin = outputPin;
    }

    public void start() {
        initialize();

        for (var worker : workers) {
            worker.start();
        }
        for (var channel : channels) {
            channel.start();
        }
    }

    private void stopThreads() {
        for (var worker : workers) {
            worker.interrupt();
        }
        for (var channel : channels) {
            channel.interrupt();
        }
    }

    public T await() throws InterruptedException, TimeoutException {
        try {
            return outputPin.getValue();
        } finally {
            stopThreads();
        }
    }

}
