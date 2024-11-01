package hu.bme.mit.ase.cps.deployments;

public abstract class Deployment {

    abstract String getName();

    abstract void deployComputers(CPS system);

    abstract boolean checkDeployment(CPS system);

}
