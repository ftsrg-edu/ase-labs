import argparse
import jinja2
import json
from pathlib import Path

parser = argparse.ArgumentParser(description='Generate Java file from template using a JSON model.')
parser.add_argument('input_model', type=str, help='Path to the input JSON model file.')
parser.add_argument('template_file', type=str, help='Path to the template file.')
parser.add_argument('output_file', type=str, help='Path to the output Java file.')

args = parser.parse_args()

output_file = Path(args.output_file)
output_file.parent.mkdir(exist_ok=True, parents=True)

with open(args.input_model, 'r') as file:
    model = json.load(file)

for in_pin in model['inPins']:
    in_pin['name'] = f"{in_pin['worker']}{in_pin['pin'].capitalize()}"
for channel in model['channels']:
    channel['name'] = f"{channel['fromWorker']}_{channel['toWorker']}_{channel['toPin']}"

template_loader = jinja2.FileSystemLoader(searchpath="./")
template_env = jinja2.Environment(loader=template_loader)
template = template_env.get_template(args.template_file)
template.stream(model).dump(args.output_file)
