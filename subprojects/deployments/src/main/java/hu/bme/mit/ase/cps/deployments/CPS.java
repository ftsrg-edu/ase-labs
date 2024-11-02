package hu.bme.mit.ase.cps.deployments;

import hu.bme.mit.ase.cps.types.computers.Computer;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

record Connection(Computer source, Computer target) { }

public class CPS {

    private final List<Computer> deployedComputers = new ArrayList<>();
    private final Set<Connection> connections = new HashSet<>();

    public void deployComputer(Computer computer) {
        deployedComputers.add(computer);
    }

    public List<Computer> getDeployedComputers() {
        return deployedComputers;
    }

    public Computer getComputerByName(String name) {
        return getDeployedComputers().stream().filter((computer -> computer.getName().equals(name))).findFirst().orElse(null);
    }

    public void installSoftware(Computer computer, String software) {

    }

    public void connectComputers(Computer source, Computer target) {
        connections.add(new Connection(source, target));
        connections.add(new Connection(target, source));
    }

    public boolean checkReachability(Computer source, Computer target) {
        if (source.equals(target)) {
            return true;
        }

        return hasConnection(source, target);
    }

    public boolean hasConnection(Computer a, Computer b) {
        return connections.contains(new Connection(a, b));
    }

    public int getNumberOfConnections() {
        return connections.size() / 2;
    }

}
