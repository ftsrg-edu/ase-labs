import argparse
import jinja2
import json
from pathlib import Path


def get_worker_type(data, worker_name):
    for worker in data["workers"]:
        if worker["name"] == worker_name:
            return worker["type"]
    return None  # Return None if the worker is not found


def get_input_type(worker, pin):
    types = {
        "Tokenizer": {
            "input": "String"
        },
        "Shingler": {
            "input": "TokenizedDocument"
        },
        "VectorMultiplier": {
            "a": "OccurrenceVector",
            "b": "OccurrenceVector",
        },
        "CosineSimilarity": {
            "aa": "Double",
            "ab": "Double",
            "bb": "Double",
        },
    }
    return types[worker][pin]


def get_output_type(worker):
    types = {
        "Tokenizer": "TokenizedDocument",
        "Shingler": "OccurrenceVector",
        "VectorMultiplier": "Double",
        "CosineSimilarity": "Double",
    }
    return types[worker]


# Set up parser
parser = argparse.ArgumentParser(description='Generate Java file from template using a JSON model.')
parser.add_argument('input_model', type=str, help='Path to the input JSON model file.')
parser.add_argument('template_file', type=str, help='Path to the template file.')
parser.add_argument('output_file', type=str, help='Path to the output Java file.')

args = parser.parse_args()

# Create output directory
output_file = Path(args.output_file)
output_file.parent.mkdir(exist_ok=True, parents=True)

# Load the domain model
with open(args.input_model, 'r') as file:
    model = json.load(file)

# Preprocess domain model - add derived names
for in_pin in model['inPins']:
    in_pin['name'] = f"{in_pin['worker']}{in_pin['pin'].capitalize()}"
    in_pin['type'] = get_input_type(get_worker_type(model, in_pin['worker']), in_pin['pin'])
for channel in model['channels']:
    channel['name'] = f"{channel['fromWorker']}_{channel['toWorker']}_{channel['toPin']}"
model['outPin']['type'] = get_output_type(get_worker_type(model, model['outPin']['worker']))

# Generate code using template
template_loader = jinja2.FileSystemLoader(searchpath="./")
template_env = jinja2.Environment(loader=template_loader)
template = template_env.get_template(args.template_file)
template.stream(model).dump(args.output_file)
