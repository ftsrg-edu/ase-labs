package hu.bme.mit.ase.cps.types.software;

import java.util.ArrayList;
import java.util.List;

public abstract class Repository {

    private final List<Software> registeredSoftware = new ArrayList<>();

    void registerSoftware(Software software) {
        registeredSoftware.add(software);
    }

    public List<Software> getRegisteredSoftware() {
        return registeredSoftware;
    }

    public abstract void registerRepository();

}
