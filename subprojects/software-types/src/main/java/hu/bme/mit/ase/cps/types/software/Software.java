package hu.bme.mit.ase.cps.types.software;

import java.util.List;

public abstract class Software {

    abstract String getName();

    abstract String getDescription();

    abstract int getPort();

    abstract List<String> getDependencies();

}
