"""Turn placeholder ids into MCP action JSON.

usage: gen.py <page-component-id> <kind> '<json {todo-key: element-id}>'
kinds: img (builder actions), icon (insert actions), btn (insert actions),
       button (builder actions for DOM buttons), props-icon / props-btn
       '<json {todo-key: instance-id}>'
"""
import json, sys

PAGE, kind, ids = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
todo = {f"{t['kind']}-{t['n']}": t for t in json.load(open('todo.json'))}
ICON_SIZE = 'dcf0a22e-4645-f795-8219-8b5f511495a2'
BUTTON_COLOR = '7dfbe752-c68b-b230-8773-0fa653eabf01'
VARIANTS = {'12px': 'd345939b-019f-e2df-81ad-4ea069bff178', '14px': 'be343e17-9894-2cac-5a01-9e068a36439f'}
CLASS_NAMES = json.load(open('classnames.json'))  # slug -> Designer name

def ref(el):
    return {'component': PAGE, 'element': el}

out = []
for key, el in ids.items():
    t = todo[key]
    if kind == 'img':
        schema = {'type': 'Image',
                  'set_image_asset': {'image_asset_id': t['asset'], 'alt_text': t['alt']}}
        if t['cls']:
            schema['set_style'] = {'style_names': [CLASS_NAMES[c] for c in t['cls']]}
        if t['attrs']:
            schema['set_attributes'] = {'attributes': [{'name': k, 'value': v} for k, v in t['attrs'].items()]}
        out.append({'build_label': key, 'parent_element_id': ref(el), 'creation_position': 'before',
                    'element_schema': schema})
    elif kind == 'icon':
        out.append({'label': key, 'insert_component_instance': {
            'component_id': ICON_SIZE, 'parent_element_id': ref(el), 'creation_position': 'before'}})
    elif kind == 'btn':
        out.append({'label': key, 'insert_component_instance': {
            'component_id': BUTTON_COLOR, 'parent_element_id': ref(el), 'creation_position': 'before'}})
    elif kind == 'props-icon':
        vals = [{'prop_id': '44081807-855d-2728-6477-5ec6f3974193', 'type': 'string', 'string_value': t['icon']}]
        if t['variant'] in VARIANTS:
            vals.append({'prop_id': 'df443ef4-a0ab-f1b2-3bb8-69d697b29d0c', 'type': 'string', 'string_value': VARIANTS[t['variant']]})
        out.append({'label': key, 'set_component_instance_prop_values': {'element_id': ref(el), 'values': vals}})
    elif kind == 'props-btn':
        vals = [{'prop_id': '82b49604-0d6c-1351-9de0-3aeb02c6ee04', 'type': 'string', 'string_value': t['label']},
                {'prop_id': '3457bcc3-5bcd-c5f0-abe7-1ae05fa3df6c', 'type': 'string', 'string_value': t['icon']}]
        if t['variant'] == 'secondary':
            vals.append({'prop_id': '540a5966-c28e-a4e5-4980-de700d5c1d8c', 'type': 'string', 'string_value': 'e13de0db-430f-b667-aee3-d545b7e6faea'})
        out.append({'label': key, 'set_component_instance_prop_values': {'element_id': ref(el), 'values': vals}})
    elif kind == 'button':
        schema = {'type': 'DOM', 'set_dom_config': {'dom_tag': 'button'},
                  'set_style': {'style_names': [CLASS_NAMES[c] for c in t['cls']]},
                  'set_attributes': {'attributes': [{'name': k, 'value': v} for k, v in t['attrs'].items()]}}
        out.append({'build_label': key, 'parent_element_id': ref(el), 'creation_position': 'before',
                    'element_schema': schema})
    elif kind == 'remove':
        out.append({'label': 'rm-' + key, 'remove_element': {'id': ref(el)}})
print(json.dumps(out))
