package hu.bme.mit.ase.sonar;

import org.sonar.check.Rule;
import org.sonar.plugins.java.api.IssuableSubscriptionVisitor;
import org.sonar.plugins.java.api.tree.*;

import java.util.Collections;
import java.util.List;

@Rule(key = "ScalarProductWithSelfRule")
public class ScalarProductWithSelfRule extends IssuableSubscriptionVisitor {
    @Override
    public List<Tree.Kind> nodesToVisit() {
        return Collections.emptyList();
    }
}
