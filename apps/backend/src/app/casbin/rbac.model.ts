export default `\
[request_definition]
r = sub, obj, act, proj

[policy_definition]
p = sub, obj, act, proj

[role_definition]
g = _, _, _
g2 = _, _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, 'root', r.proj) || (g(r.sub, p.sub, r.proj) && g2(r.obj, p.obj, r.proj) && r.act == p.act && r.proj == p.proj)
`;

/**
# Policy

p, alice, data1, read, proj1
p, bob, data2, write, proj1
p, data_group_admin, data_group, write, proj1

g, alice, data_group_admin, proj1
g2, data1, data_group, proj1
g2, data2, data_group, proj1
*/

/**
# Request

alice, data1, read, proj1
alice, data1, write, proj1
alice, data2, read, proj1
alice, data2, write, proj1
root, data2, write, proj1
root1, data2, write, proj1
*/

/**
# Enforcement Result

true
true
false
true
true
false
*/
