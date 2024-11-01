package hu.bme.mit.ase.cps.types.computers;

public abstract class Computer {

    private final String name;
    private final String ip;

    Computer(String name, String ip) {
        this.name = name;
        this.ip = ip;
    }

    public String getName() {
        return name;
    }

    public String getIp() {
        return ip;
    }

    abstract String getOs();

    abstract String getDescription();

    abstract ComputerResources getResources();

}
