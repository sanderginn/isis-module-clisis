/*
 *  Copyright 2014~2015 Dan Haywood
 *
 *  Licensed under the Apache License, Version 2.0 (the
 *  "License"); you may not use this file except in compliance
 *  with the License.  You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 */
package org.isisaddons.module.xxx.fixture.scripts.scenarios;

import org.apache.isis.applib.fixturescripts.DiscoverableFixtureScript;

import org.isisaddons.module.xxx.fixture.dom.XxxDemoObject;
import org.isisaddons.module.xxx.fixture.dom.XxxDemoObjects;
import org.isisaddons.module.xxx.fixture.scripts.teardown.XxxDemoObjectsTearDownFixture;

public class XxxDemoObjectsFixture extends DiscoverableFixtureScript {

    public XxxDemoObjectsFixture() {
        withDiscoverability(Discoverability.DISCOVERABLE);
    }

    @Override
    protected void execute(final ExecutionContext executionContext) {

        // prereqs
	executionContext.executeChild(this, new XxxDemoObjectsTearDownFixture());

        // create
        create("Foo", executionContext);
        create("Bar", executionContext);
        create("Baz", executionContext);
    }

    // //////////////////////////////////////

    private XxxDemoObject create(final String name, final ExecutionContext executionContext) {
        return executionContext.addResult(this, xxxDemoObjects.create(name));
    }

    // //////////////////////////////////////

    @javax.inject.Inject
    private XxxDemoObjects xxxDemoObjects;

}
