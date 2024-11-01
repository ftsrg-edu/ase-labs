package hu.bme.mit.ase.cps.types.computers;

public class ComputerResources {

    private final String memory;
    private final String cpu;
    private final String storage;

    public ComputerResources(String memory, String cpu, String storage) {
        this.memory = memory;
        this.cpu = cpu;
        this.storage = storage;
    }

    public String getMemory() {
        return memory;
    }

    public String getCpu() {
        return cpu;
    }

    public String getStorage() {
        return storage;
    }
}
