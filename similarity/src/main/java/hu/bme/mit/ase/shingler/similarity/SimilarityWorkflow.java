package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.workflow.impl.*;
import hu.bme.mit.ase.shingler.workflow.lib.*;

public class SimilarityWorkflow extends Workflow<Double> {

    // Input pin declarations

    public final Pin<String> tokenizerAInput = new Pin<>();
    public final Pin<String> tokenizerBInput = new Pin<>();

    // Parameter declarations

    private final boolean granularity;
    private final int size;

    public SimilarityWorkflow(boolean granularity, int size) {
        this.granularity = granularity;
        this.size = size;
    }

    @Override
    protected void initialize() {
        // Worker declarations

        var tokenizerA = new TokenizerWorker(granularity);
        var tokenizerB = new TokenizerWorker(granularity);

        var shinglerA = new ShinglerWorker(size);
        var shinglerB = new ShinglerWorker(size);

        var vectorAA = new VectorMultiplierWorker();
        var vectorAB = new VectorMultiplierWorker();
        var vectorBB = new VectorMultiplierWorker();

        var cosine = new CosineSimilarityWorker();

        // Adding all workers

        addWorker(tokenizerA);
        addWorker(tokenizerB);
        addWorker(shinglerA);
        addWorker(shinglerB);
        addWorker(vectorAA);
        addWorker(vectorAB);
        addWorker(vectorBB);
        addWorker(cosine);

        // Set output pin

        setOutputPin(cosine.outputPin);

        // Input pin channel declarations

        var input_ta_input = new Channel<>(tokenizerAInput, tokenizerA.inputPin);
        var input_tb_input = new Channel<>(tokenizerBInput, tokenizerB.inputPin);

        // Channel declarations

        var ta_sa = new Channel<>(tokenizerA.outputPin, shinglerA.inputPin);
        var tb_sb = new Channel<>(tokenizerB.outputPin, shinglerB.inputPin);

        var sa_vaa_a = new Channel<>(shinglerA.outputPin, vectorAA.aPin);
        var sa_vaa_b = new Channel<>(shinglerA.outputPin, vectorAA.bPin);
        var sa_vab_a = new Channel<>(shinglerA.outputPin, vectorAB.aPin);

        var sb_vab_b = new Channel<>(shinglerB.outputPin, vectorAB.bPin);
        var sb_vbb_a = new Channel<>(shinglerB.outputPin, vectorBB.aPin);
        var sb_vbb_b = new Channel<>(shinglerB.outputPin, vectorBB.bPin);

        var vaa_c_aa = new Channel<>(vectorAA.outputPin, cosine.aaPin);
        var vab_c_ab = new Channel<>(vectorAB.outputPin, cosine.abPin);
        var vbb_c_bb = new Channel<>(vectorBB.outputPin, cosine.aaPin);

        // Add input pin channels

        addChannel(input_ta_input);
        addChannel(input_tb_input);

        // Add channels

        addChannel(ta_sa);
        addChannel(tb_sb);
        addChannel(sa_vaa_a);
        addChannel(sa_vaa_b);
        addChannel(sa_vab_a);
        addChannel(sb_vab_b);
        addChannel(sb_vbb_a);
        addChannel(sb_vbb_b);
        addChannel(vaa_c_aa);
        addChannel(vab_c_ab);
        addChannel(vbb_c_bb);
    }

}
