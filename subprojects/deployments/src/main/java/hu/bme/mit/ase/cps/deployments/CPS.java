package hu.bme.mit.ase.cps.deployments;

import hu.bme.mit.ase.cps.types.computers.Computer;
import hu.bme.mit.ase.cps.types.software.Software;

public abstract class CPS {

    public abstract void installSoftware(Computer computer, String software);

    public abstract void deployComputer(Computer computer);

    public abstract void connectComputers(Computer source, Computer target);

    public abstract boolean checkReachability(Computer source, Computer target);

}
