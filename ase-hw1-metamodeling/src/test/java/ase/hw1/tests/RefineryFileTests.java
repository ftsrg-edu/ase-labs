package ase.hw1.tests;

import org.junit.jupiter.api.Test;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class RefineryFileTests {
    private InputStream getResourceAsStream() {
        return getClass().getClassLoader().getResourceAsStream("hw1.problem");
    }

    static List<String> toLines(InputStream stream) {
        return new BufferedReader(new InputStreamReader(stream)).lines().toList();
    }
    static final String magicLine = "% % Please do not modify anything below this line.";
    static int linePosition(List<String> lines) {
        for(int i = 0; i<lines.size(); i++) {
            if(lines.get(i).startsWith(magicLine)) {
                return i;
            }
        }
        return -1;
    }
    static String concatFirstLines(List<String> lines, int position) {
        return String.join("\n", lines.subList(0,position));
    }

    @Test
    void problemFileExistsTest() {
        InputStream resourceAsStream = getResourceAsStream();
        assertNotNull(resourceAsStream);
    }

    @Test
    void problemHasMagicLine() {
        InputStream resourceAsStream = getClass().getClassLoader().getResourceAsStream("hw1.problem");
        assertNotNull(resourceAsStream);
        int linePosition = linePosition(toLines(resourceAsStream));
        assertNotEquals(-1,linePosition);
    }

    @Test
    void solutionNotEmpty() {
        InputStream resourceAsStream = getClass().getClassLoader().getResourceAsStream("hw1.problem");
        assertNotNull(resourceAsStream);
        List<String> lines = toLines(resourceAsStream);
        int linePosition = linePosition(lines);
        assertNotEquals(-1,linePosition);
        String solution = concatFirstLines(lines,linePosition);
        assertNotEquals(0,solution.length());
    }
}
