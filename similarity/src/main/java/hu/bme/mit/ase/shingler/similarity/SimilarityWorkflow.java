package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.workflow.impl.CosineSimilarityWorker;
import hu.bme.mit.ase.shingler.workflow.impl.ShinglerWorker;
import hu.bme.mit.ase.shingler.workflow.impl.TokenizerWorker;
import hu.bme.mit.ase.shingler.workflow.impl.VectorMultiplierWorker;
import hu.bme.mit.ase.shingler.workflow.lib.Channel;
import hu.bme.mit.ase.shingler.workflow.lib.Pin;
import hu.bme.mit.ase.shingler.workflow.lib.Workflow;

public class SimilarityWorkflow extends Workflow<Double> {

    public final Pin<String> tokenizerAInput = new Pin<>();
    public final Pin<String> tokenizerBInput = new Pin<>();

    private final boolean granularity;
    private final int size;

    public SimilarityWorkflow(boolean granularity, int size) {
        this.granularity = granularity;
        this.size = size;
    }

    @Override
    protected void initialize() {
        var tokenizerA = new TokenizerWorker(granularity);
        var tokenizerB = new TokenizerWorker(granularity);

        var shinglerA = new ShinglerWorker(size);
        var shinglerB = new ShinglerWorker(size);

        var vectorAA = new VectorMultiplierWorker();
        var vectorAB = new VectorMultiplierWorker();
        var vectorBB = new VectorMultiplierWorker();

        var cosine = new CosineSimilarityWorker();

        addWorker(tokenizerA);
        addWorker(tokenizerB);
        addWorker(shinglerA);
        addWorker(shinglerB);
        addWorker(vectorAA);
        addWorker(vectorAB);
        addWorker(vectorBB);
        addWorker(cosine);

        setOutputPin(cosine.outputPin);

        var input_ta_input = new Channel<>(tokenizerAInput, tokenizerA.inputPin);
        var input_tb_input = new Channel<>(tokenizerBInput, tokenizerB.inputPin);

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

        addChannel(input_ta_input);
        addChannel(input_tb_input);

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
