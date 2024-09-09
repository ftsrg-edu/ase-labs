package hu.bme.mit.ase.shingler.lib;

import java.util.List;

public interface DocumentDiversityComputor {

    List<Integer> computeDiversity(String document, boolean wordGranularity);

}
