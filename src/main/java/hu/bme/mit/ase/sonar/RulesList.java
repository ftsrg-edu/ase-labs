package hu.bme.mit.ase.sonar;

import org.sonar.plugins.java.api.JavaCheck;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public final class RulesList {
    private RulesList() {
    }

    public static List<Class<? extends JavaCheck>> getChecks() {
        List<Class<? extends JavaCheck>> checks = new ArrayList<>();
        checks.addAll(getJavaChecks());
        checks.addAll(getJavaTestChecks());
        return Collections.unmodifiableList(checks);
    }

    // Rules that should run on main source files.
    public static List<Class<? extends JavaCheck>> getJavaChecks() {
        return Collections.singletonList(ScalarProductWithSelfRule.class);
    }

    // Rules that should run on test source files.
    public static List<Class<? extends JavaCheck>> getJavaTestChecks() {
        return Collections.emptyList();
    }
}
