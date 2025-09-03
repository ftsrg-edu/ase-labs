package hu.bme.mit.ase.shingler.lib;

import hu.bme.mit.ase.shingler.lib.data.TokenizedDocument;

import java.util.List;

public interface DiversityListComputor {

    List<Integer> computeDiversityList(TokenizedDocument document);

}
