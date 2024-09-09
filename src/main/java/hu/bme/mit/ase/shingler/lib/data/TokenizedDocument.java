package hu.bme.mit.ase.shingler.lib.data;

import java.util.ArrayList;
import java.util.List;

public class TokenizedDocument extends ArrayList<TokenVector> {

    public TokenizedDocument(List<TokenVector> tokenVectors) {
        super(tokenVectors);
    }

}
