package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.lib.DocumentSimilarityEstimator;
import hu.bme.mit.ase.shingler.logic.BaseCosineSimilarityComputor;
import hu.bme.mit.ase.shingler.logic.BaseOccurrenceVectorComputor;
import hu.bme.mit.ase.shingler.logic.BaseTokenizer;
import hu.bme.mit.ase.shingler.logic.BaseVectorMultiplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import picocli.CommandLine;
import picocli.CommandLine.Command;
import picocli.CommandLine.Option;
import picocli.CommandLine.Parameters;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@Command(name = "diversity")
public class SimilarityApp implements Runnable {

    private static final Logger logger = LoggerFactory.getLogger(SimilarityApp.class);

    @Parameters
    private File file1;

    @Parameters
    private File file2;

    @Parameters(defaultValue = "3")
    private int shingleSize;

    @Option(names = { "-w", "--word-granularity" })
    private boolean isWordGranularity;

    @Option(names = { "-m", "--multithreaded" })
    private boolean isMultiThreaded;

    @Override
    public void run() {
        DocumentSimilarityEstimator similarityEstimator = getDocumentSimilarityEstimator();

        String document1;
        String document2;

        logger.info("Reading input files");

        try {
            document1 = Files.readString(file1.toPath());
            document2 = Files.readString(file2.toPath());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        logger.info("Estimating similarity of input files");

        var result = similarityEstimator.computeSimilarity(document1, document2, shingleSize, isWordGranularity);

        System.out.println("Similarity:" + result);
    }

    private DocumentSimilarityEstimator getDocumentSimilarityEstimator() {
        DocumentSimilarityEstimator similarityEstimator;

        if (isMultiThreaded) {
            similarityEstimator = new MultiThreadedDocumentSimilarityEstimator(
                    new BaseTokenizer(),
                    new BaseOccurrenceVectorComputor(),
                    new BaseVectorMultiplier(),
                    new BaseCosineSimilarityComputor()
            );
        } else {
            similarityEstimator = new SingleThreadedDocumentSimilarityEstimator(
                    new BaseTokenizer(),
                    new BaseOccurrenceVectorComputor(),
                    new BaseVectorMultiplier(),
                    new BaseCosineSimilarityComputor()
            );
        }

        return similarityEstimator;
    }

    public static void main(String[] args) {
        logger.info("Running Similarity app!");

        new CommandLine(new SimilarityApp()).execute(args);
    }

}
