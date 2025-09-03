package hu.bme.mit.ase.shingler.diversity;

import hu.bme.mit.ase.shingler.logic.BaseDiversityListComputor;
import hu.bme.mit.ase.shingler.logic.BaseTokenizer;
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
public class DiversityApp implements Runnable {

    private static final Logger logger = LoggerFactory.getLogger(DiversityApp.class);

    @Parameters
    private File file;

    @Option(names = { "-w", "--word-granularity" })
    private boolean isWordGranularity;

    @Override
    public void run() {
        var diversityComputor = new SimpleDocumentDiversityComputor(
                new BaseTokenizer(),
                new BaseDiversityListComputor()
        );

        String document;

        try {
            document = Files.readString(file.toPath());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        var result = diversityComputor.computeDiversity(document, isWordGranularity);
        System.out.println("Diversity of input document is " + result);
    }

    public static void main(String[] args) {
        logger.info("Running Diversity app!");
        new CommandLine(new DiversityApp()).execute(args);
    }
}
