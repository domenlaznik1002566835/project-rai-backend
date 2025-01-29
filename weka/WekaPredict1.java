import weka.core.Instances;
import weka.core.DenseInstance;
import weka.core.Attribute;
import weka.classifiers.meta.AdaBoostM1;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.io.File;

public class WekaPredict1 {
    public static void main(String[] args) throws Exception {
        System.out.println("WekaPredictor started.");
        
        // Validate arguments
        if (args.length < 1) {
            System.err.println("Model path not provided.");
            System.exit(1);
        }

        String modelPath = args[0];
        File modelFile = new File(modelPath);
        if (!modelFile.exists()) {
            System.err.println("Model file not found: " + modelPath);
            System.exit(1);
        }
        System.out.println("Loading model from: " + modelPath);

        // Define attributes
        ArrayList<Attribute> attributes = new ArrayList<>();
        String[] attributeNames = {
            "home_info", "history_tracking", "reserve_locker", "manage_locker",
            "web_rating", "login_difficulty", "face_reliability", "registration_process",
            "scanner_accuracy", "unlocking_reliability", "history_navigation",
            "mobile_rating", "solution_time_in_seconds"
        };
        
        for (String name : attributeNames) {
            attributes.add(new Attribute(name));
        }

        ArrayList<String> classValues = new ArrayList<>();
        classValues.add("bad");
        classValues.add("good");
        attributes.add(new Attribute("poll", classValues));

        try {
            // Load model
            AdaBoostM1 model = (AdaBoostM1) weka.core.SerializationHelper.read(modelPath);

            // Create Instances object
            Instances dataSet = new Instances("TestInstances", attributes, 0);
            dataSet.setClassIndex(dataSet.numAttributes() - 1);

            // Read and validate input
            BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
            String line = reader.readLine();
            
            if (line == null || line.trim().isEmpty()) {
                System.err.println("No input provided");
                System.exit(1);
            }

            String[] values = line.split(",");
            if (values.length != attributes.size() - 1) {
                System.err.println("Expected " + (attributes.size() - 1) + " values, got " + values.length);
                System.exit(1);
            }

            // Convert and validate input values
            double[] instanceValue = new double[dataSet.numAttributes()];
            for (int i = 0; i < values.length; i++) {
                try {
                    double val = Double.parseDouble(values[i].trim());
                    // Validate ranges for ratings (1-5)
                    if (i < values.length - 1 && (val < 1 || val > 5)) {
                        System.err.println("Rating value out of range (1-5) at position " + (i + 1));
                        System.exit(1);
                    }
                    instanceValue[i] = val;
                } catch (NumberFormatException e) {
                    System.err.println("Invalid number format at position " + (i + 1) + ": " + values[i]);
                    System.exit(1);
                }
            }

            // Create and classify instance
            DenseInstance instance = new DenseInstance(1.0, instanceValue);
            instance.setDataset(dataSet);
            double prediction = model.classifyInstance(instance);
            
            System.out.println(dataSet.classAttribute().value((int) prediction));

        } catch (Exception e) {
            System.err.println("Error processing prediction: " + e.getMessage());
            System.exit(1);
        }
    }
}