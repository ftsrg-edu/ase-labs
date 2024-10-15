package hu.bme.mit.ase.shingler.workflow.lib;

import java.util.concurrent.TimeoutException;

public class Channel<T> extends Thread {

    private final Pin<T> inputPin;
    private final Pin<T> outputPin;

    public Channel(Pin<T> inputPin, Pin<T> outputPin) {
        this.inputPin = inputPin;
        this.outputPin = outputPin;
    }

    @Override
    public void run() {
        try {
            outputPin.setValue(inputPin.getValue());
        } catch (InterruptedException e) {
            interrupt();
        } catch (TimeoutException e) {
            throw new RuntimeException(e);
        }
    }
}
