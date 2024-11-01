import argparse
import jinja2
import json
from pathlib import Path

# Set up parser
parser = argparse.ArgumentParser(description='Generate the Software Types.')
parser.add_argument('input_model', type=str, help='Path to the input JSON model file.')
parser.add_argument('template_file', type=str, help='Path to the template file.')
parser.add_argument('output_directory', type=str, help='Path to the output directory.')

args = parser.parse_args()

# Create output directory
output_directory = Path(args.output_directory)
output_directory.mkdir(exist_ok=True, parents=True)

# Load the domain model
with open(args.input_model, 'r') as file:
    model = json.load(file)

# Generate code using template
template_loader = jinja2.FileSystemLoader(searchpath="./")
template_env = jinja2.Environment(loader=template_loader)
template = template_env.get_template(args.template_file)

for computer_type in model["computer_types"]:
    template.stream(computer_type).dump(str(output_directory / f"{computer_type["name"]}.java"))
