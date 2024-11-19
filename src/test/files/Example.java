import hu.bme.mit.ase.shingler.lib.VectorMultiplier;
import hu.bme.mit.ase.shingler.lib.data.OccurrenceVector;
import hu.bme.mit.ase.shingler.logic.BaseVectorMultiplier;

class Example {
    public double example1(VectorMultiplier multiplier, OccurrenceVector v) {
        multiplier.computeScalarProduct(v, v); // Noncompliant
    }

    public double example2(OccurrenceVector v) {
        var multiplier = new BaseVectorMultiplier();
        multiplier.computeScalarProduct(v, v); // Noncompliant
    }

    public double example3(VectorMultiplier multiplier, OccurrenceVector u, OccurrenceVector v) {
        multiplier.computeScalarProduct(u, v); // Compliant, the two arguments are different.
    }

    public double example4(OccurrenceVector v) {
        return computeScalarProduct(v, v); // Compliant, not the targeted method.
    }

    private double computeScalarProduct(OccurrenceVector u, OccurrenceVector v) {
        return 3.14;
    }
}
